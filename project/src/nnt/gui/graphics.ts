module nn {

    export class CPen {

        width: number = 1;
        color = Color.Black;
    }

    export class CBrush {
        color = Color.Black;
    }

    export class CPainter {

        pen: CPen;
        brush: CBrush;
    }
}
